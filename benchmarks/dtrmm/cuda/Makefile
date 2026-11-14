CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/dtrmm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dtrmm: dtrmm.c $(HDRS) | $(BIN)
	$(CC) dtrmm.c -o $(BIN)/dtrmm -lcublas

clean:
	rm -rf $(BIN)
