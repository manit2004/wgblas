CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dtrsv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dtrsv: dtrsv.c $(HDRS) | $(BIN)
	$(CC) dtrsv.c -o $(BIN)/dtrsv -lcublas

clean:
	rm -rf $(BIN)
