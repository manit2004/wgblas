CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/drotm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/drotm: drotm.c $(HDRS) | $(BIN)
	$(CC) drotm.c -o $(BIN)/drotm -lcublas

clean:
	rm -rf $(BIN)
